import logo from '../../assets/images/logo.svg';
import './Starting.css';

function Starting() {
  return (
    <main className="starting-page">
      <section className="starting-content">
        <div className="starting-logo">
          <img src={logo} alt="SWin" />

          <div className="starting-wordmark">
            SW<span>in</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Starting;