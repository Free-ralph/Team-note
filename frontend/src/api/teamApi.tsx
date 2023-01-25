import { axiosPrivate } from "./AuthApi";
import { TeamData } from "../pages/NewTeam";



async function createTeamFn ( data : TeamData ){
    const response = await axiosPrivate.post('/team', {...data})
    return response.data
}

async function updateTeamFn (data : TeamData ){
    const response = await axiosPrivate.patch('/team', { ...data })
    return response.data
}

async function getTeams (){
    const response = await axiosPrivate.get('/teams')
    return response.data
}

async function deleteTeam (id : string){
    // TODO make sure the person is authorized to this
    const response = await axiosPrivate.get(`/team/${id}`)
    return response.data
}

async function getTeamByID (id : string | undefined ){
    const response = await axiosPrivate.get(`/team/${id}`)
    return response.data
}


export {createTeamFn,
    updateTeamFn,
    getTeams,
    deleteTeam,
    getTeamByID }