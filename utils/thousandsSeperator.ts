const formatNumber = (num: number | string): string => {
    if (typeof num === 'string') {
      num = parseFloat(num);
    }
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  
  export default formatNumber;
  