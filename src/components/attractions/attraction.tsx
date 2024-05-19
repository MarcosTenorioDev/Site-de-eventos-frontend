const Attraction = (props: {img:string, title:string, description:string}) => {
    const {img, title, description} = props
  return (
    <div className="flex justify-between space-x-4">
      <img src={img} alt="" className="w-16 h-16 rounded-full" />
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-xs text-muted-foreground w-11/12">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Attraction;
