import { joinRoom } from "../actions/joinRoom";


export default async function Home() {

  return <div style={{
    display: "flex",
    height: '100dvh',
    width: '100dvw',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 2
  }}>
    <form action={joinRoom} style={{
      display: "flex",
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 2
    }}>
      <input type="text" name="roomId" placeholder="roomId" />
      <button type="submit" style={{
      }} >Join
      </button>
    </form>


  </div>
}