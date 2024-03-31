import '../css/information.css';
import '../index.css';

function Information(props: {title: string, content: string})
{
  return (
    <div className="container">
      <div>
        <p className="header">{props.title}</p>
      </div>
      <div>
        <p className="content">{props.content}</p>
      </div>
    </div>
  )
}

export default Information