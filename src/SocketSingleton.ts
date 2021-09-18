export c Singleton {
    import io from 'socket.io-client'

    export function someMethod () {
        return socket = io('http://localhost:5000')
    }
}
