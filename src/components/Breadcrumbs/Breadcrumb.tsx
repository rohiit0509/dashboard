interface BreadcrumbProps {
  pageName: string;
  textSize:string
}
const Breadcrumb = ({ pageName, textSize }: BreadcrumbProps) => {
  return (
    <div className="pb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className={`text-title-${textSize} font-semibold text-black dark:text-white`}>
        {pageName}
      </h2>
    </div>
  );
};

export default Breadcrumb;
