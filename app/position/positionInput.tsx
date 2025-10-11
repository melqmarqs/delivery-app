interface PositionInputParams {
  title: string
  description: string
  value: string
  placeholder?: string
  color: string
  error: boolean
  onChangeInput: (value: string) => void
  onBlur?: () => void
}

export function PositionInput(params: PositionInputParams) {
  return (
    <div className="grid justify-items-center content-start gap-3">
      <div className="grid justify-items-center">
        <label>
          enter the &nbsp;
          <label className={`text-xl font-bold text-${params.color}-500`}>{params.title}</label>
        </label>
        <label className={`text-${params.color}-300/70`}>
          {params.description}
        </label>
      </div>
      <input
        type="text"
        maxLength={2}
        value={params.value}
        className={`uppercase border-2 rounded-xl p-2 text-center ${params.error ? 'border-red-500' : ''}`}
        placeholder={params.placeholder}
        onChange={e => params.onChangeInput(e.target.value)}
        onBlur={params.onBlur} />
    </div>
  )
}