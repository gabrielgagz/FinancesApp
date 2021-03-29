CREATE TABLE users (
  user_id SERIAL NOT NULL,
  user_email VARCHAR(50) NOT NULL,
  user_firstname VARCHAR(50) NOT NULL,
  user_lastname VARCHAR(50) NOT NULL,
  user_nickname VARCHAR(50) NOT NULL,
  user_password VARCHAR(8) NOT NULL,
  user_profilepic VARCHAR(250) NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE movements (
  movement_id SERIAL NOT NULL,
  movement_date TIMESTAMP NOT NULL,
  movement_type VARCHAR(50) NOT NULL,
  movement_amount BIGINT NOT NULL,
  movement_userid INTEGER NOT NULL,
  PRIMARY KEY (movement_id),
  FOREIGN KEY (movement_userid) REFERENCES users(user_id)
);