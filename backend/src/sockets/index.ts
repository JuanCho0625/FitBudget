import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./ISocket";
 
export const setupSocketHandlers = (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}` )

        socket.on('join-user-room', (userId => {
            socket.join(userId)
            console.log(`Usuario ${userId} unido a su sala privada`)
        }))

        socket.on('disconnect', () => {
            console.log('Usuario desconectado')
        })
    })
}