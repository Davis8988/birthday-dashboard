interface Props {
  currentView: string;
  onSelectView: (item: string) => void;
  loggedIn: boolean;
}

const Navigation = ({ currentView, onSelectView, loggedIn }: Props) => {
  if (loggedIn == false) {
    return <></>;
  } else {
    return (
      <>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className={
                currentView === "Dashboard" ? "nav-link active" : "nav-link"
              }
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
              onClick={() => onSelectView("Dashboard")}
            >
              Dashboard
            </button>
          </div>
        </nav>
      </>
    );
  }
};

export default Navigation;
