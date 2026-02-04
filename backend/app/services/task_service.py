"""
app/services/task_service.py
────────────────────────────
CRUD business logic for tasks.
Ownership is enforced at this layer:
  • regular users can only see / edit / delete their own tasks
  • admins can operate on *all* tasks
"""

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, TaskListResponse


class TaskService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.user = current_user

    # ── helpers ───────────────────────────────────
    def _base_query(self):
        """Return a SELECT that already applies ownership scoping."""
        qs = select(Task)
        if self.user.role != "admin":
            qs = qs.where(Task.owner_id == self.user.id)
        return qs

    async def _get_or_404(self, task_id: str) -> Task:
        result = await self.db.execute(
            self._base_query().where(Task.id == task_id)
        )
        task = result.scalar_one_or_none()
        if task is None:
            raise FileNotFoundError("Task not found")
        return task

    # ── Create ────────────────────────────────────
    async def create(self, payload: TaskCreate) -> TaskOut:
        task = Task(
            title=payload.title,
            description=payload.description,
            priority=payload.priority,
            status=payload.status,
            owner_id=self.user.id,
        )
        self.db.add(task)
        await self.db.flush()
        return TaskOut.model_validate(task)

    # ── Read (single) ────────────────────────────
    async def get(self, task_id: str) -> TaskOut:
        task = await self._get_or_404(task_id)
        return TaskOut.model_validate(task)

    # ── Read (paginated list) ─────────────────────
    async def list(self, page: int = 1, page_size: int = 10) -> TaskListResponse:
        offset = (page - 1) * page_size

        # total count (with same ownership filter)
        count_qs = select(func.count()).select_from(Task)
        if self.user.role != "admin":
            count_qs = count_qs.where(Task.owner_id == self.user.id)
        total = (await self.db.execute(count_qs)).scalar() or 0

        # paginated rows
        rows_qs = (
            self._base_query()
            .order_by(Task.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.db.execute(rows_qs)
        tasks = [TaskOut.model_validate(t) for t in result.scalars().all()]

        return TaskListResponse(tasks=tasks, total=total, page=page, page_size=page_size)

    # ── Update ────────────────────────────────────
    async def update(self, task_id: str, payload: TaskUpdate) -> TaskOut:
        task = await self._get_or_404(task_id)
        updates = payload.model_dump(exclude_unset=True)
        for key, value in updates.items():
            setattr(task, key, value)
        await self.db.flush()
        return TaskOut.model_validate(task)

    # ── Delete ────────────────────────────────────
    async def delete(self, task_id: str) -> None:
        task = await self._get_or_404(task_id)
        await self.db.delete(task)
        await self.db.flush()
