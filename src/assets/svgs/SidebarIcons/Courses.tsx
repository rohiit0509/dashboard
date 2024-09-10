import { SVGProps } from "react"
const Courses = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    {...props}
  >
    <path
      fill="#704FE4"
      d="M5.156 13.125a.937.937 0 1 0 0-1.875.937.937 0 0 0 0 1.875ZM11.719 13.125a.937.937 0 1 0 0-1.875.937.937 0 0 0 0 1.875ZM13.383 3.538a.7.7 0 0 0-.544-.257H3.923l-.18-1.019a.469.469 0 0 0-.462-.387H1.406a.469.469 0 0 0 0 .938h1.482l1.338 7.58a.469.469 0 0 0 .462.388h7.5a.469.469 0 1 0 0-.937H5.08l-.166-.938h7.08a.705.705 0 0 0 .69-.565l.844-4.219a.704.704 0 0 0-.146-.584Z"
    />
  </svg>
)
export default Courses
