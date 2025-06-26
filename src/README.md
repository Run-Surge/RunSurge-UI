modify the dashboard to include a button with view Groups
this should redirect to a page to display all the user groups 
similar to the UI for the dashboard Jobs 
Group Name	Status	Created	Actions Number of Jobs

when View Details is clicked it should redirect to 
group/[groupid]

Here are the status 
class GroupStatus(str, Enum):
    pending = 'pending'
    running = 'running'
    completed = 'completed'
    failed = 'failed'


@router.get("/", response_model=List[GroupRead])
async def get_groups(
    session: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user_from_cookie)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        group_service = get_group_service(session)
        groups = await group_service.get_groups_by_user_id(user_id=current_user["user_id"])
        return groups
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class GroupBase(BaseModel):
    group_id: int
    group_name: str
    python_file_name: str
    num_of_jobs: int
    created_at: datetime
    aggregator_file_name: str
    status: GroupStatus

class GroupRead(GroupBase):
    jobs: Optional[List[ComplexJobRead]] = []
