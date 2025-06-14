export const getSessionId = () => {
   let id = localStorage.getItem("session-id");

   if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("session-id", id);
   }

   return id;
}