import { SVGProps } from "react"
const TickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={56}
    fill="none"
    {...props}
  >
    <rect width={48} height={48} x={4} y={4} fill="#D1FADF" rx={24} />
    <rect
      width={48}
      height={48}
      x={4}
      y={4}
      stroke="#ECFDF3"
      strokeWidth={8}
      rx={24}
    />
    <path
      stroke="#039855"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m23.5 28 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z"
    />
  </svg>
)
export default TickIcon
