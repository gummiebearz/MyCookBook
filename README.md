## MYCOOKBOOK

This is a Next.js project called __MyCookBook__, which sells recipes of different food categories.\
To view the detailed recipes, the user must create an account and purchase them.
Each purchase is different and unique. Regardless of whether the user has already purchased a recipe, the new purchase will still
include the price for that recipe.

<img width="1505" alt="image" src="https://user-images.githubusercontent.com/64393177/192123279-92bfba22-00f3-468d-8d45-274bb87edd7d.png">

<img width="1211" alt="image" src="https://user-images.githubusercontent.com/64393177/192123342-9aa25b56-7404-4be7-a994-992316373869.png">


### Authentication

User can sign in via Magic Link (verification of email per signin) or OAuth (currently supports Google)

### Checkout

Each checkout session is handled by Stripe and is valid for __30__ minutes\. The backend is responsible for generating a Stripe
checkout session and the UI redirects the user to that session.
Upon successful payment, a __confirmation__ will be sent to the email of the user (*__PRODUCTION ONLY__*)

## Tools used

- Next.js
- Stripe
- Supabase (alternative to Firebase)
- Chakra-UI
- Rapid API for fetching foods

### Made by [Gumball](https://github.com/gumball09) with :purple_heart:
