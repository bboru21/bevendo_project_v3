export const formatSearchLabel = (label, q) => {
  const regEx = new RegExp(q, 'gi');
  return (
    <span
      dangerouslySetInnerHTML={
        {__html: label.replace(regEx, '<strong>$&</strong>')}
      }
    ></span>
  );
}