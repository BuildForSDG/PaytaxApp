#  #PayTax App

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/21fe87768d424c2e85b089afea2f2084)](https://app.codacy.com/gh/BuildForSDG/PayTax-app?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDG/PayTax-app&utm_campaign=Badge_Grade_Settings)

## About

This Application aims to enhance the process of tax collection with a platform that allows for a seamless tax payment.



## Why

-  Tax payers can easily pay tax from the comfort of the their business locations and offices.
-  People don't have to queue up at offices to pay tax.
-  The government can save operational cost of sending tax agents to business locations and offices. 
-  We're essentially functioning as a third party service, we can deduct a token for the service charge.
-  Easily get tax receipts. 

## Usage
### API guide for consuming this back-end layer. 

**Individual businesses and Companies registration.**
Upon registration the Tax payer gets returned a Tax Payer ID by email and json response.

`POST`  https://paytax-app.herokuapp.com/api/v1/users/register

Request format: Individual business

`{
	"company":"false",
	"name":"dougals",
	"address":"lagos",
	"email":"rickpeterson@gmail.com",
	"phone":"09060016252",
	"bvn":"124214141235",
	"password":"wqdsafdsfds242153",
	"state":"lagos",
	"city":"laten town"
}` 

Request format: Company

` {
	"company":"true",
	"name":"peterson",
	"address":"lagos",
	"email":"y@y.com",
	"phone":"09067026252",
	"bvn":"124214141235",
	"password":"wqdsafdsfds242153",
	"state":"lagos",
	"city":"ogba"
}`

****

**Individual businesses and Companies login.**

This request returns an access token upon  Authentication or error messages. 

`POST`  https://paytax-app.herokuapp.com/api/v1/user/login

Request format: 

`{
	"taxID":"SyNcnrmKJy",
	"password":"password123456"
}`

****

**Business data for Authenticated users.**

Returns all company and individual biodata.

`GET`  https://paytax-app.herokuapp.com/api/v1/use/biodata/:taxID 

****

**Tax types for payment**

Returns all tax types (IRS), payable through this platform. this is a protected route, so a user needs to be authenticated.

Also update this service with more tax types , integrated here.

`GET`  https://paytax-app.herokuapp.com/api/v1/payments/tax_types

`POST` https://paytax-app.herokuapp.com/api/v1/payments/tax_types

****

**Tax payment history**

Return all tax payment transactions performed using this payment service. this is a protected route, so a user needs to be authenticated.
`GET`    https://paytax-app.herokuapp.com/api/v1/payments/history/:taxPayerID

****

**Integrate Payment gateway **

 This is a protected route, so a user needs to be authenticated.

Upon filling the name, amount and email form and sending the request, it redirects you to the standard payment gateway modal.

Upon successful payment it redirects you to the base route and sends a payment receipt to the email you provided. 

`POST`   https://paytax-app.herokuapp.com/api/v1/gateway/pay

Request format: 

`{
	"name":"dickson douglas",
	"amount":"3000",
	"email":"ricknet@gmail.com"
}`

## Setup

Install `npm` or `yarn` if you dont have any of them already installed. We recommend Yarn though.

After clonning the repo to your local machine and moving into the cloned folder, Run `yarn install` to get started by installing dependencies. 

`src/server.js` is the entry to the project and source code should go into the `src` folder.

All tests should be written in the `__tests__' folder. There's a sample in there.

#### Hints

- Run `npm install` or `yarn install` to get started. We'll assume you are using Yarn.
- Install additional dependencies: `yarn add <dependency-name> [-D]`
- Run tests: `yarn test`
- Run tests with test coverage info: `yarn test:cover`
- Check the codebase for proper syntax and formatting compliance: `yarn lint`
- Run your app in local dev mode: `yarn start`. This puts the bundled app in a `dist` folder, set up a local web server at localhost:3000, and continues to watch for your code changes which it syncs with the local server. This means if you loaded the app in a browser, it will auto-refresh as you code along. Feel free to use whatever bundler best meets your needs. Parcel was only added as a sample and for those looking for a simple but effective solution to the hassle of bundlers. 

## Authors

Peterson Oaikhenah  (TTL)

<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[Nextwebb](https://github.com/nextwebb "")
<img src="https://img.icons8.com/fluent/64/000000/link.png"/>[Portfolio](https://nextwebb.com.ng/nextwebb "portfolio website")
<img src="https://img.icons8.com/fluent/48/000000/twitter.png"/>[I_am_nextwebb](https://twitter.com/i_am_nextwebb "twitter profile")

Ben Kovie
<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[Ben Kovie](https://github.com/ben-kovie "")

Chika Ani
<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[Chika Ani](https://github.com/casmonas "")

Oluwaseun Olorunsola (Mentor)
<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[triple0t](https://github.com/triple0t "")

Daniel Ufeli
<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[Daniel Ufeli](https://github.com/danielufeli "")

Sammiepius
<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[Sammiepius](https://github.com/sammiepius "")

Gospel Chinyereugo
<img src="https://img.icons8.com/cute-clipart/64/000000/github.png"/>[Ebugo](https://github.com/Ebugo "")



## Contributing

If this project sounds interesting to you and you'd like to contribute, thank you!
First, you can send a mail to buildforsdg@andela.com to indicate your interest, why you'd like to support and what forms of support you can bring to the table, but here are areas we think we'd need the most help in this project :

1.  area one (e.g this app is about human trafficking and you need feedback on your roadmap and feature list from the private sector / NGOs)
2.  area two (e.g you want people to opt-in and try using your staging app at staging.project-name.com and report any bugs via a form)
3.  area three (e.g here is the zoom link to our end-of sprint webinar, join and provide feedback as a stakeholder if you can)

## Acknowledgements

Did you use someone else’s code?
Do you want to thank someone explicitly?
Did someone’s blog post spark off a wonderful idea or give you a solution to nagging problem?

It's powerful to always give credit.

## LICENSE
MIT

