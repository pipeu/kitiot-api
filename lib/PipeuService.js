import axios from 'axios/index';

const { API_URL, API_TOKEN, API_TOKEN_HEADER } = process.env;
const api = axios.create({
  baseURL: API_URL,
  headers: { [API_TOKEN_HEADER]: API_TOKEN }
})

export async function getStoreId(email) {
  try {
    console.log(`Requesting to API to retrieve store by Email ${email}`);
    const { data } = await api.get(`/1.0/store/email/${email}`);
    return data.id;
  } catch (e) {
    console.log('Error while trying to retrieve Store by E-mail', e);
  }
}

export async function getStoreByWhatsAppNumber(number) {
  console.log('getStoreByWhatsAppNumber', number)
  console.log('API_URL', API_URL)
  console.log('API_TOKEN', API_TOKEN)
  try {
    console.log(`Requesting to API to retrieve store by WhatsAppNumber ${number}`);
    const { data } = await api.get(`/1.0/store/whatsAppNumber/${number}`);
    return data;
  } catch (e) {
    console.log('Error while trying to retrieve Store by WhatsAppNumber', e);
  }
}

// Try to find people by mobile number
export async function getDetailedPersonData(email) {
  try {
    console.log(`Requesting to API to retrieve detailed person data from Email ${email}`);
    const { data } = await api.get(`/1.0/services/person.enrich/${email}`);
    return data.status === 200 ? data : null;
  } catch (e) {
    console.log('Error while trying to retrieve detailed person data by E-mail', e);
  }
}

export async function getCustomerByMobilePhone(storeId, mobile) {
  try {
    console.log(`Requesting to API to retrieve Customer by storeId${storeId} and Mobile ${mobile}`)

    console.log('API_URL', API_URL)
    console.log('API_TOKEN', API_TOKEN)

    const axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        [API_TOKEN_HEADER]: API_TOKEN,
        'storeId': storeId
      }
    })

    const { data } = await axiosInstance.get(`/1.0/useraccount/searchByFilter?q=${mobile}`);
    // console.log('data', data)

    return data

  } catch (e) {
    console.log('Error while trying to retrieve Customer by Mobile on Pipeu', e);
  }
}
