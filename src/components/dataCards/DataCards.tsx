import "./DataCards.css";
import * as coreService from "../../services/coreService";
import * as toastrService from "../../services/toastrService";
import { useEffect, useState } from "react";
interface DataCardsProps {
  cardData: any;
}

function DataCards({ cardData }: DataCardsProps) {
  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const [showAllProposed, setShowAllProposed] = useState(false);
  const initialDisplayLimit = 3;

  const toggleDisplayCurrent = () => {
    setShowAllCurrent(!showAllCurrent);
  };
  const toggleDisplayProposed = () => {
    setShowAllProposed(!showAllProposed);
  };

  const displayLimitedCurrentSpend = () => {
    return cardData?.current_spend?.Data?.slice(
      0,
      showAllCurrent ? undefined : initialDisplayLimit
    ).map((data: any, i: number) => (
      <div key={i} className="country-data">
        <p className="m-0">{data?.location}</p>
        <h6 className="m-0">{data?.totalSalary}</h6>
      </div>
    ));
  };

  const displayLimitedProposedSpend = () => {
    return cardData?.proposed_new_spend?.Data?.slice(
      0,
      showAllProposed ? undefined : initialDisplayLimit
    ).map((data: any, i: number) => (
      <div key={i} className="country-data">
        <p className="m-0">{data?.location}</p>
        <h6 className="m-0">{data?.totalSalary}</h6>
      </div>
    ));
  };

  return (
    <>
      <div>
        {/* overall report data cards */}
        <div className="row gap-16 p-0">
          <div className="col pe-0">
            <div className="data-card">
              <img src="/assets/images/camera-icon.svg" alt="Cash-Difference" />
              <div>
                <h4 className="m-0">{cardData?.cash_difference}</h4>
                <span>Remaining Allocation</span>
              </div>
            </div>
          </div>
          <div className="col px-0">
            <div className="data-card">
              <img
                src="/assets/images/dudgeted-icon.svg"
                alt="Budgeted-Increase"
              />
              <div>
                <h4 className="m-0">{cardData?.budgeted_increase?.value}%</h4>
                <span>Budgeted Increase</span>
              </div>
            </div>
          </div>
          <div className="col ps-0">
            <div className="data-card">
              <img
                src="/assets/images/requited-icon.svg"
                alt="Requested-Increase"
              />
              <div>
                <h4 className="m-0">{cardData?.request_increase}</h4>
                <span>Requested Increase</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3 gap-16">
          <div className="col pe-0">
            <div className="country-data-card">
              <div className="data-head">
                <p className="m-0">Total Current Spend</p>
                <h6 className="m-0">
                  {" "}
                  {cardData?.current_spend?.total_current_spend}
                </h6>
              </div>
              {displayLimitedCurrentSpend()}
              <div className="view-all">
                <button onClick={toggleDisplayCurrent}>
                  {showAllCurrent ? "View Less" : "View All"}
                </button>
              </div>
            </div>
          </div>

          <div className="col ps-0">
            <div className="country-data-card">
              <div className="data-head">
                <p className="m-0">Proposed New Spend</p>
                <h6 className="m-0">
                  {cardData?.proposed_new_spend?.total_proposed_new_spend}
                </h6>
              </div>
              {displayLimitedProposedSpend()}
              <div className="view-all">
                <button onClick={toggleDisplayProposed}>
                  {showAllProposed ? "View Less" : "View All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataCards;
