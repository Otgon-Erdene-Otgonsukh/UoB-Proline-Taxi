import Log from "@/component/Log_forgot"

const page = () => {
  return (
    <div><Log logIn={true} forgot={false} codeSent={false} reset={false}/></div>
  )
}

export default page