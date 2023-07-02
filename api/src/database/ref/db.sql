// CELEB API DATABASER DIAGRAM
// app id: com.celebapi.xxxx

// Countries 
Table countries {
  id bigserial
  name varchar
  code varchar
  timezone varchar
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
  currency_id bigserial [ref: > currencies.id]
}

// Currencies 
Table currencies {
  id bigserial
  name varchar
  code varchar
  symbol varchar
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}


// ROLES
Table roles {
  id varchar [pk]
  name varchar [not null, unique]
  description longtext
  permissions permissions
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}

// PERMISSIONS
Table permissions {
  id varchar [pk]
  name varchar [not null, unique]
  description longtext [null]
  create boolean
  read boolean
  update boolean
  delete boolean
}

// PROVIDERS
// Auth Provider, either is google sign in or apple sign in
Table providers {
  id bigserial [pk]
  name varchar [not null, unique, note: "google || apple || facebook || xxx"]
  description varchar
  key varchar
  secret_key varchar
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}

// MEMBERSHIPS
Table memberships {
  id bigserial [pk]
  name varchar [not null, unique]
  description varchar
  price varchar
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}

// USERS
Table users {
  id varchar [pk]
  username varchar [not null, unique, note: "username"]
  email varchar [unique, note: "email address"]
  password varchar [not null, note: "password"]
  full_name varchar
  contact_number varchar [unique, note: "user contact number"]
  membership_id bigserial [ref: > memberships.id]
  remarks longtext
  gender varchar
  age int
  avatar longtext [note: "user profile image"]
  role_id bigserial [ref: > roles.id]
  provider_id  bigserial [ref: > providers.id]
  country_id bigserial [ref: > countries.id]
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}

// INFLUENCERS
Table influencers {
  id varchar [pk]
  username varchar [not null, unique, note: "username"]
  full_name varchar
  bio longtext [unique, note: "some description"]
  num_of_followers int [unique, note: "number of followers"]
  avatar longtext [note: "influencer profile image"]
  role_id bigserial [ref: > roles.id]
  country_id bigserial [ref: > countries.id]
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}

// CHATROOMS
Table chatrooms {
  id varchar [pk]
  user_id bigserial [ref: > users.id]
  influencer_id bigserial [ref: > influencers.id]
  last_message_id bigserial [ref: > messages.id ]
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}

// MESSAGES
Table messages {
  id varchar [pk]
  chatroom_id bigserial [ref: > chatrooms.id]
  user_id bigserial [ref: > users.id, note: "user id"]
  influencer_id bigserial [ref: > users.id, note: "influencers"]
  content longtext
  is_influencer boolean 
  is_seen boolean
  activated boolean
  created_at timestamp
  updated_at timestamp
  created_by varchar
  updated_by varchar
}