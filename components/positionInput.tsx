import type { InputColor } from "models/input"

interface PositionInputParams {
  title: string
  description: string
  value: string
  placeholder?: string
  color: InputColor
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
          <label className={`text-xl font-bold ${params.color.textColor}`}>{params.title}</label>
        </label>
        <label className={`${params.color.descriptionColor}`}>
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