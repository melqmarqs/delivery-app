interface ConfirmButtonParams {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode
}

export function SuccessButton(params: ConfirmButtonParams) {
  return (
    <button
      className={`rounded-xl cursor-pointer border-2 size-full border-green-500 bg-green-700 disabled:bg-gray-700 disabled:border-gray-500 disabled:text-gray-400 disabled:cursor-not-allowed`}
      disabled={!params.disabled}
      onClick={params.onClick}
    >
      {params.children}
    </button>
  )
}