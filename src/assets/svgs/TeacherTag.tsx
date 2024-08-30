import { SVGProps } from "react"
const TeacherTag = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={11}
    fill="none"
    {...props}
  >
    <g fill="#2D3748" clipPath="url(#a)">
      <path d="M1.031 3.648V7.88l4.125 2.43V6.098l-4.125-2.45ZM5.844 10.309l4.125-2.43V3.65L5.844 6.097v4.21ZM9.625 3.09 5.5.684 1.375 3.09 5.5 5.496 9.625 3.09Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0-.003h11v11H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default TeacherTag
