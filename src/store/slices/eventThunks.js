import { catalogService, sellerService } from "@/services";

/**
 * Create a new event for a shop
 * Uses centralized sellerService method
 */
export const createevent = (data) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const event = await sellerService.createEvent(data);
    dispatch({
      type: "eventCreateSuccess",
      payload: event,
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Get all events for a specific shop
 * Uses centralized sellerService method
 */
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsShopRequest",
    });

    const events = await sellerService.getShopEvents(id);
    dispatch({
      type: "getAlleventsShopSuccess",
      payload: events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Delete an event from a shop
 * Uses centralized sellerService method
 */
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteeventRequest",
    });

    const message = await sellerService.deleteEvent(id);

    dispatch({
      type: "deleteeventSuccess",
      payload: message,
    });
  } catch (error) {
    dispatch({
      type: "deleteeventFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/**
 * Get all events across all shops (marketplace-wide)
 * Uses centralized catalogService method
 */
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const events = await catalogService.getEvents();
    dispatch({
      type: "getAlleventsSuccess",
      payload: events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};