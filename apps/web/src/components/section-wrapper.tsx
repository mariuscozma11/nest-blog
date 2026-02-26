interface SectionWrapperProps {
  children: React.ReactNode;
}

const SectionWrapper = ({ children }: SectionWrapperProps) => {
  return (
    <div className="w-full border-t border-dashed">
      <div className="border-x border-dashed max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;
