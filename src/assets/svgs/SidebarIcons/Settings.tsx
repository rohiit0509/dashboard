import { SVGProps } from "react"
const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#704FE4"
      d="M14.257 4.031a.468.468 0 0 0-.748-.117l-1.8 1.801a.472.472 0 0 1-.663 0l-.778-.779a.468.468 0 0 1 0-.663L12.06 2.48a.468.468 0 0 0-.14-.759c-1.354-.605-3.044-.29-4.11.768-.905.899-1.174 2.303-.74 3.854a.466.466 0 0 1-.13.468l-4.878 4.455a1.88 1.88 0 1 0 2.654 2.655L9.22 9.033A.466.466 0 0 1 9.68 8.9c.44.121.896.184 1.354.187.978 0 1.837-.317 2.456-.927 1.147-1.13 1.322-3.047.766-4.128Zm-10.842 9.57a.937.937 0 1 1-.203-1.864.937.937 0 0 1 .203 1.864Z"
    />
  </svg>
)
export default SettingsIcon
