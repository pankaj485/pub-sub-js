class App {
  // 	using private property for messages in order to keep encapsulation
  #messages = [];
  #currentMessage = null;
  #totalMailsGenerated = 0;

  /* 
    Data CRUD operations
  */

  //  addMessage:  add a new message and publish updated data
  addMessage(message) {
    this.#messages.push(message);
    this.#publish();
    this.#totalMailsGenerated += 1;
  }

  // deleteMessage:  delete a message from the list and publish updated data
  deleteMessage(id) {
    const currentMessages = [...this.data];
    const index = currentMessages.findIndex((_) => _.id === id);

    // remove the message from the list
    currentMessages.splice(index, 1);
    this.#messages = currentMessages;

    this.#publish();
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

  setCurrentMessage(message) {
    if (this.#currentMessage) {
      const currentId = this.currentMessage.id;
      document
        .getElementById(`email-title-${currentId}`)
        ?.classList.remove("current-title");
    }

    this.#currentMessage = message;
    document
      .getElementById(`email-title-${message.id}`)
      ?.classList.add("current-title");
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

  get currentMessage() {
    return this.#currentMessage;
  }

  get totalGenerateMails() {
    return this.#totalMailsGenerated;
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
    let p = document.createElement("p");
    p.setAttribute("id", `email-title-${message.id}`);
    ulContainer.appendChild(p);

    p.innerHTML = unread ? `<b>${title}</b><span> (unread)</span>` : title;
    p.addEventListener("click", (e) => {
      e.preventDefault();
      app.markMessageAsRead(message.id);
      app.setCurrentMessage(message);
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

  if (!firstEmail) {
    app.setCurrentMessage(null);
    emailTitle.innerText = "";
    emailBody.innerHTML = "";

    return;
  }

  app.setCurrentMessage(firstEmail);
  emailTitle.innerText = firstEmail.title;
  emailBody.innerHTML = firstEmail.body;
};

// add a new email to the email list
document.getElementById("add-email").addEventListener("click", (e) => {
  e.preventDefault();
  const messageId = app.totalGenerateMails + 1;
  const newMessage = {
    id: messageId,
    title: "Message " + messageId,
    body: `This is the message having title: <b>Message ${messageId}</b>`,
    unread: Math.random() > 0.5,
  };
  app.addMessage(newMessage);
});

document.getElementById("delete-mail-btn").addEventListener("click", (e) => {
  e.preventDefault();

  if (app.currentMessage) {
    app.deleteMessage(app.currentMessage.id);
  }
});

// add subscribers functions to the app instance
app.subscribe(renderEmailList);
app.subscribe(renderInboxCount);
app.subscribe(viewEmailContent);

for (let i = 1; i <= 5; i++) {
  const messageId = app.totalGenerateMails + 1;
  const newMessage = {
    id: messageId,
    title: "Message " + messageId,
    body: `This is the message having title: <b>Message ${messageId}</b>`,
    unread: Math.random() > 0.5,
  };

  app.addMessage(newMessage);
}
