class App {
  // 	using private property for messages in order to keep encapsulation
  #messages = [];

  /* 
    Data CRUD operations
  */

  //  addMessage:  add a new message and publish updated data
  addMessage(message) {
    this.#messages.push(message);
    this.#publish(this.data);
  }

  // markMessageAsRead:  set unread flag to false for the requested message and publish updated data
  markMessageAsRead(messageId) {
    // find the requested mesage from messge id
    const requestedMessage = this.#messages.find(
      (message) => message.id === messageId
    );
    // set unread flag to false for the requested mesasge
    requestedMessage["unread"] = false;
    this.#publish(this.data);
  }

  /* 
    Pub/Sub operations
  */

  // keep track of subscribers in order to publish updated data
  #subscribers = [];

  // 	subscribe:  add a subscriber to the subscribers array
  subscribe(subscriber) {
    this.#subscribers.push(subscriber);
  }

  // 	publish:  trigger subscribers with new data
  #publish() {
    // trigger subscribers with new data
    this.#subscribers.forEach((subscriber) => subscriber(this.data));
  }

  // 	get data:  return a copy of the messages array

  get data() {
    return [...this.#messages];
  }
}

// Create a new instance of the App class to implemnet pub/sub model
const app = new App();

/* 
  Subscriber functions, each time the data is updated, the subscriber functions will be triggered
*/

// renderEmailList:  render the email list with title and unread flag status if the message is unread
const renderEmailList = (data) => {
  const ulContainer = document.getElementById("list-container");
  ulContainer.innerHTML = "";

  data.forEach((message) => {
    const { unread, title } = message;
    let li = document.createElement("li");
    ulContainer.appendChild(li);

    li.innerHTML = unread ? `<b>${title}</b><span> (unread)</span>` : title;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      app.markMessageAsRead(message.id);
      viewEmailContent([message]);
    });
  });
};

// renderInboxCount:  render the total number of unread mails
const renderInboxCount = (data) => {
  document.getElementById("email-counter").innerText = data.filter(
    (message) => message.unread
  ).length;
};

// viewEmailContent:  render the content of clicked email in the email list
const viewEmailContent = (data) => {
  const firstEmail = data[0];
  const emailTitle = document.getElementById("email-title");
  const emailBody = document.getElementById("email-body");

  emailTitle.innerText = firstEmail.title;
  emailBody.innerHTML = firstEmail.body;
};

// add a new email to the email list
document.getElementById("add-email").addEventListener("click", (e) => {
  e.preventDefault();
  const newMessageId = app.data.length + 1;
  const newMessage = {
    id: newMessageId,
    title: "Message " + newMessageId,
    body: `This is the message having title: <b>Message ${newMessageId}</b>`,
    unread: Math.random() > 0.5,
  };
  app.addMessage(newMessage);
});

// add subscribers functions to the app instance
app.subscribe(renderEmailList);
app.subscribe(renderInboxCount);
app.subscribe(viewEmailContent);

for (let i = 1; i <= 5; i++) {
  app.addMessage({
    id: i,
    title: "Message " + i,
    body: `This is the message having title: <b>Message ${i}</b>`,
    unread: Math.random() > 0.5,
  });
}
