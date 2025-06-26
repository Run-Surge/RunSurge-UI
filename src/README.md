I want to implement result upload on group/[groupid] page 
if the status is completed, then the UI should render a button called Download the result, also display the status of the Group
no need to handle chunking on this endpoint
but make its time out bigger

Here is the endpoint 
The endpoint url is api/group/{groupid}/result

@router.get("/{group_id}/result")
async def get_group_result(
    group_id: int,
    session: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user_from_cookie)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    group_service = get_group_service(session)
    group = await group_service.get_group_by_id(group_id=group_id)
    if group.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    if group.status != GroupStatus.completed:
        raise HTTPException(status_code=400, detail="Group is not completed yet")
    file_path = os.path.join(GROUPS_DIRECTORY_PATH, str(group_id), f"{group.output_data_file.file_name}.zip")
    return FileResponse(
        path=file_path,
        filename=f"{group.output_data_file.file_name}.zip",
        media_type="application/zip"
    )