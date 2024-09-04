import { SVGProps } from "react"
const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={14}
    fill="none"
    {...props}
  >
    <path
      stroke="#3D3D3D"
      strokeWidth={1.167}
      d="M10.982 6.38c.797.444.8 1.003 0 1.505L4.8 12.055c-.777.414-1.304.17-1.36-.728l-.026-8.725c-.017-.827.663-1.06 1.312-.664l6.256 4.442Z"
    />
  </svg>
)
export default PlayIcon
