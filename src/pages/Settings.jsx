
const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mt-4">Settings</h2>
      <div className="fixed bottom-8 w-3/4 md:w-2/5 lg:w-1/5">
        <button className="btn btn-error text-secondary w-full">Logout</button>
      </div>
    </div>
  )
}
export default Settings;