import plus from "./assets/plus-circle 1.png"
import icon from "./assets/icons8-notes-app 1.png"
import React, { useEffect, useState } from "react"
import {io} from "socket.io-client";



export const Dashboard : React.FC = () => {

    const [notes,setnotes] = useState<any[]>([])
    const [todo,settodo] = useState<string>("")
    const [socket,setsocket] = useState<any>(null)

    useEffect(() => {
        const newsocket = io("localhost:3000",{
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });
        setsocket(newsocket);

        
        newsocket.on("tasks-fetched", (tasks: string[]) => {
            setnotes(prev => [...prev, ...tasks]);
        });

        newsocket.on("task-added", (tasks: string[]) => {
            setnotes(tasks);
        });

        
        newsocket.emit("get-tasks");
        console.log(notes);
        return () => {
            newsocket.disconnect(); 
        };
    }, []);
    

    const createTodo = async () => {
        if (!todo.trim()) {
            console.log("Task cannot be empty");
            return;
        }

        if (socket) {
            socket.emit("add-task", {task : todo}); 
            settodo(""); 
        } else {
            console.error("Socket is not connected");
        }
    };


    return (
        <>
            <h1 className="text-center m-10">Todo Dashboard</h1> 
            <div className="flex flex-col border-2 border-gray-300 rounded-lg gap-5  w-1/3 p-5 mx-auto">
                <h1 className="font-bold text-3xl flex items-center"><img src={icon} alt="" />Note App</h1>
                <div className="flex justify-between">
                    <input type="text" onChange={(e) => settodo(e.target.value)} value={todo} placeholder="New Note..." className="border-2 text-xl border-gray-400 rounded-lg w-full p-2 shadow shadow-lg" />
                    <button onClick={createTodo} className="flex gap-3 items-center border border-2 bg-[#92400E] rounded-lg px-5 py-3 text-xl font-bold text-white"><img className="h-6" src={plus} alt="" />Add</button>
                </div> 
                <div>
                    <h1 className="font-bold text-2xl">Notes</h1>
                    <hr />
                    <div className="flex flex-col mt-5 overflow-y-scroll scroll-blue-400 h-50">
                       
                        {
                            notes ? (
                                notes.map((note : any) => {
                                    return (
                                        <div key={note._id} className="flex flex-col gap-2">
                                            <h2 className="text-xl my-3 ">{note.task}</h2>
                                            <hr />
                                        </div>
                                    )
                                })
                            ) : (
                                "No notes available"
                            )
                        }
                    </div>
                </div>
                
            </div>
        </>
    )
}