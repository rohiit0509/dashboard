import { SVGProps } from "react"
const SmallTickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="#68D391"
      d="M7.497 1.406A6.1 6.1 0 0 0 1.403 7.5a6.1 6.1 0 0 0 6.094 6.094A6.1 6.1 0 0 0 13.591 7.5a6.1 6.1 0 0 0-6.094-6.094Zm3.171 4.052-3.937 4.687a.469.469 0 0 1-.352.168h-.008a.47.47 0 0 1-.348-.156L4.336 8.282a.469.469 0 1 1 .696-.627L6.36 9.13l3.592-4.274a.469.469 0 0 1 .717.603Z"
    />
  </svg>
)
export default SmallTickIcon
