import { userData } from "../user.js";
import { getHandleFromName, getRandomDate, random } from "../utils.js";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export function Card({ issue, user }) {
  if (window.DEBUG) {
    user = { ...userData };
  }
  user.handle = getHandleFromName(user.name.first, user.name.last);
  const date = getRandomDate();

  return (
    <div class="card">
      <div class="card__header">
        <div class="card__user-wrap">
          <div class="card__user-img-wrap">
            <img src={user.picture.medium} width="60" />
          </div>
          <div>
            <h3 class="card__user-name">
              {user.name.first} {user.name.last}
            </h3>
            <span class="card__user-handle">{user.handle}</span>
          </div>
        </div>
        <div>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="#35A1F2"
              d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
            />
          </svg>
        </div>
      </div>
      <p>{issue.message}</p>
      <div class="card__meta">
        <svg
          style="width:1em;height:1em;margin-right: 5px;position:relative;top:2px;"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"
          />
        </svg>
        <span style="margin-right:16px;">{random(0, 30)}</span>
        <span>
          {date.getHours() % 13}:{date.getMinutes()}{" "}
          {Math.random() > 0.5 ? "PM" : "AM"}- {months[date.getMonth()]}{" "}
          {date.getDate()}, {date.getFullYear()}
        </span>
      </div>

      <div class="card__image">
        <img src={issue.imageUrl} />
      </div>
    </div>
  );
}
