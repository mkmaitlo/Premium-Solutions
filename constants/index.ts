export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Create Subscription',
    route: '/subscriptions/create',
  },
  {
    label: 'My Subscriptions',
    route: '/my-subscriptions',
  },
]

export const subscriptionDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
}
