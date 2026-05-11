import { useToastStore } from '../../store/useToastStore'

function Toast() {
  const { message, isToastVisible } = useToastStore()

  if (!isToastVisible) return null

  return (
    <div className="toast toast-top toast-end z-50">
      <div className="alert alert-error">
        <span>{message}</span>
      </div>
    </div>
  )
}
export default Toast
