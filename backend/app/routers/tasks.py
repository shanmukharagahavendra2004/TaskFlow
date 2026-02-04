from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.task_service import TaskService
from app.utils.response import success_response, error_response

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task = await TaskService(db, current_user).create(payload)
    return success_response(
        message="Task created",
        data=task.model_dump(mode="json"),
        status_code=status.HTTP_201_CREATED,
    )



@router.get("/", status_code=status.HTTP_200_OK)
async def list_tasks(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await TaskService(db, current_user).list(page, page_size)
    return success_response(data=result.model_dump(mode="json"))



@router.get("/{task_id}", status_code=status.HTTP_200_OK)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        task = await TaskService(db, current_user).get(task_id)
        return success_response(data=task.model_dump(mode="json"))
    except FileNotFoundError:
        return error_response(message="Task not found", status_code=status.HTTP_404_NOT_FOUND)



@router.put("/{task_id}", status_code=status.HTTP_200_OK)
async def update_task(
    task_id: str,
    payload: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        task = await TaskService(db, current_user).update(task_id, payload)
        return success_response(message="Task updated", data=task.model_dump(mode="json"))
    except FileNotFoundError:
        return error_response(message="Task not found", status_code=status.HTTP_404_NOT_FOUND)

@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        await TaskService(db, current_user).delete(task_id)
        return success_response(message="Task deleted")
    except FileNotFoundError:
        return error_response(message="Task not found", status_code=status.HTTP_404_NOT_FOUND)
