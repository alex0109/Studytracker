const LibraryLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="flex flex-col items-center pb-10">{children}</div>;
};

export default LibraryLayout;
