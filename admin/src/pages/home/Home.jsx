import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import {selectCurrentUser}from "../../redux/userRedux"
import { useSelector } from "react-redux";
import {Redirect} from "react-router-dom";
import {useEffect,useMemo,useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../requestMethods"

export default function Home() {
  const admin=useSelector(selectCurrentUser);
  const [userStats, setUserStats] = useState([]);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(BASE_URL+"users/countVendorStart",{
          headers: {

            Authorization: "Bearer " + admin.accessToken
  
          },
        });
        res.data.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], "Active User": item.total },
          ])
        );
      } catch {}
    };
    getStats();
  }, [MONTHS]);
  return (
    <div className="home">
      {!admin?.role.Admin&&(<Redirect to="/login" ></Redirect>)}
      <FeaturedInfo />
      <Chart data={userStats} title="User Analytics" grid dataKey="Active User"/>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
