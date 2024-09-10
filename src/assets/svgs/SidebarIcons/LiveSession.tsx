import { SVGProps } from "react"
const LiveSession = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#704FE4"
      d="M1.438 11.516a1.64 1.64 0 0 0 1.64 1.64h9.844a1.64 1.64 0 0 0 1.64-1.64V7.004H1.438v4.512ZM3.37 9.289a.879.879 0 0 1 .879-.879h1.406a.879.879 0 0 1 .88.88v.585a.879.879 0 0 1-.88.879H4.25a.879.879 0 0 1-.879-.879v-.586ZM12.922 2.843H3.078a1.64 1.64 0 0 0-1.64 1.64v.762h13.124v-.762a1.64 1.64 0 0 0-1.64-1.64Z"
    />
  </svg>
)
export default LiveSession
