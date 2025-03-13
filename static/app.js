// Add scrollbar indicators to tables
document.addEventListener("DOMContentLoaded", () => {
  const tableContainers = document.querySelectorAll(".table-container")

  tableContainers.forEach((container) => {
    // Add scroll indicators if content is scrollable
    container.addEventListener("scroll", () => {
      const maxScroll = container.scrollHeight - container.clientHeight

      if (maxScroll > 0) {
        if (container.scrollTop === 0) {
          container.classList.remove("scroll-top")
        } else {
          container.classList.add("scroll-top")
        }

        if (container.scrollTop >= maxScroll - 5) {
          container.classList.remove("scroll-bottom")
        } else {
          container.classList.add("scroll-bottom")
        }
      }
    })

    // Trigger scroll event to initialize indicators
    container.dispatchEvent(new Event("scroll"))
  })
  
  // Handle collapsible panels
  const panelHeaders = document.querySelectorAll(".panel-header[data-panel-target]")

  panelHeaders.forEach((header) => {
    const targetId = header.getAttribute("data-panel-target")
    const panelBody = document.querySelector(targetId)
    const collapseIcon = header.querySelector(".collapse-icon")

    // Initialize collapse icons based on panel state
    if (panelBody.classList.contains("collapsed")) {
      collapseIcon.classList.add("collapsed")
    }

    header.addEventListener("click", () => {
      // Toggle the panel body
      panelBody.classList.toggle("collapsed")

      // Toggle the collapse icon
      collapseIcon.classList.toggle("collapsed")
    })
  })

  // Chat widget functionality
  const chatIcon = document.getElementById("chatIcon")
  const chatPanel = document.querySelector(".chat-panel")
  const closeChat = document.getElementById("closeChat")
  const messageInput = document.getElementById("messageInput")
  const sendMessage = document.getElementById("sendMessage")
  const chatMessages = document.getElementById("chatMessages")
  const firstPanelLoading = document.querySelector("#panel1Content .loading-container")
  const secondPanelLoading = document.querySelector("#panel2Content .loading-container")
  const thirdPanelLoading = document.querySelector("#panel3Content .loading-container")
  const fourthPanelLoading = document.querySelector("#panel4Content .loading-container")  
  var divName ="";
  var keys;
  const userInput = "CONVERSATION between Relationship Manager and Client (Mr. Tan) - RELATIONSHIP MANAGER: Hello Mr. Tan how are you? You makan already? CLIENT: Makan already. What about you? RELATIONSHIP MANAGER: Me too, thanks! I am calling you today because there is a new high-return investment opportunity called the Great Fund. It primarily invests in emerging markets, small-cap stocks, and alternative assets. This kind of investments has very high returns. It will make you a lot of money!  CLIENT: Sure or not? Is it going to be risky? RELATIONSHIP MANAGER: Aiyoo! Don’t worry, the risk is very minimal. The fees can be covered by the huge returns you will be making eventually. At most you will lose about 1% of your investment. CLIENT: What kind of returns are we talking about? RELATIONSHIP MANAGER: The Great Fund projects an average annual return of 20% year on year. Very shiok right? CLIENT: Hmm ok! I am interested in investing about 1 million SGD but need more information first. Oh, just to be sure, I can only afford to lose 100,000 SGD max on this, ok? RELATIONSHIP MANAGER: Ok!  This investment plan is the key to further enabling your financial freedom, with your current net worth, you can definitely afford this, and even use it as a trust fund for your grandchildren!  Once I have the paper work ready, I’ll invite you to our branch at Yio Chu Kang for signing. CLIENT: Thanks! I'll wait for the paperwork. Bye!"
  
  fetch("/get-secrets")
  .then(response => response.json())
  .then(data => {
    console.log("All Secrets:", data);
    keys = data;
    callSummary(keys.AZURE_CALL_SUMMARY_ENDPOINT, keys.AZURE_CALL_SUMMARY_API_KEY);
    trainingSummary(keys.AZURE_TRAINING_SUMMARY_ENDPOINT,keys.AZURE_TRAINING_SUMMARY_API_KEY);
    rmGrading(keys.AZURE_RMGRADING_ENDPOINT, keys.AZURE_RMGRADING_API_KEY);
    redoneConversation(keys.AZURE_CONVERSATION_ENDPOINT, keys.AZURE_CONVERSATION_API_KEY);
  })
  .catch(error => console.error("Error fetching secrets:", error)); 

  // Toggle chat panel
  chatIcon.addEventListener("click", () => {
    chatPanel.classList.toggle("hidden")
    if (!chatPanel.classList.contains("hidden")) {
      messageInput.focus()
      scrollChatToBottom()
    }
  })

  // Close chat panel
  closeChat.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent event from bubbling to panel header
    chatPanel.classList.add("hidden")
  })

  

  // Function to scroll chat to bottomsummarize the call in tabular format
  function scrollChatToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function callSummary(endPoint, apiKey){
    if(endPoint && apiKey){
      divName = 'divCallSummary' 
      showLoadingImage(divName)
      
      const finalUserInput = userInput + "\nProvide a summary of the conversation using a table only - Use headings, format everything into ONE NEAT VERTICAL TABLE FIELDS BELOW EACH OTHER, with the relevant fields (Topic, Customer, Product, Product Details from Factsheet, RM’s pitch, Customer’s response, Follow-up (if any)). The 2 column headers for the table should be Field and Description. Refer to the text in the conversation and for Product details, refer to the Fund Factsheet.";
      
      callRAGEndpoint(finalUserInput, endPoint, apiKey, divName, function(result) {
        $('#divCallSummary').append(formatResponse(result))      
        hideLoadingImage('divCallSummary')
      });
    }
    else{
      $('#divCallSummary').append("Please provide the end point and api key to get the response")
    }
    
    
  }

  function trainingSummary(endPoint, apiKey){
    if(endPoint && apiKey){
      divName = 'divTrainingModule'
      showLoadingImage(divName)      
      const finalUserInput = userInput + "\nGrade the above RM-customer conversation (no need to show the grading) and provide training recommendations for the RM against this list of training programs. Show the Training plan in a neat table format.";
      
      callRAGEndpoint(finalUserInput, endPoint, apiKey, divName, function(result) {
        var output = formatResponse(result)
        $('#divTrainingModule').append(output);
        hideLoadingImage('divTrainingModule')
      });
    }
    else{
      $('#divTrainingModule').append("Please provide the end point and api key to get the response")
    }
  }

  function rmGrading(endPoint, apiKey){
    if(endPoint && apiKey){
      divName = 'divrmGrading'
      showLoadingImage(divName)      
      const finalUserInput = userInput + "\nGrade the RM’s performance in the conversation against the 10 standards in the Bank’s policy document provided above.";
      
      callRAGEndpoint(finalUserInput, endPoint, apiKey, divName, function(result) {      
        $('#divrmGrading').append(formatResponse(result));
        hideLoadingImage('divrmGrading')
      });
    }
    else{
      $('#divrmGrading').append("Please provide the end point and api key to get the response")
    }
  }

  function redoneConversation(endPoint, apiKey){
    if(endPoint && apiKey){
      var divName = 'divredoneConversation'
      showLoadingImage(divName)      
      const finalUserInput = userInput + "\nRedo the above conversation in a compliant manner, and display it in a neat manner with a header at the start (in markdown format)";
      
      callRAGEndpoint(finalUserInput, endPoint, apiKey, divName, function(result) {
        // console.log(formatResult(result))
        $('#divredoneConversation').append(formatMarkdownResponse(result));
        hideLoadingImage('divredoneConversation')
      });
    }
    else{
      $('#divredoneConversation').append("Please provide the end point and api key to get the response")
    }
  }

  // Send message function
  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${isUser ? "user" : "bot"}`
    
    chatMessages.appendChild(messageDiv)
    if(isUser){
      messageDiv.textContent = message
    }
    else{
      typeMessage(messageDiv, message);
    }    
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
  // Create typing indicator with animated dots
  function createTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message bot typing-message"

    const indicatorSpan = document.createElement("div")
    indicatorSpan.className = "typing-indicator"

    // Create the three dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span")
      indicatorSpan.appendChild(dot)
    }

    typingDiv.appendChild(indicatorSpan)
    return typingDiv
  }
  // Handle sending messages
  function handleSendMessage() {
    const message = messageInput.value.trim()
    if (message) {
      addMessage(message, true)
      messageInput.value = ""

      // Add typing indicator with animated dots
      const typingIndicator = createTypingIndicator()
      chatMessages.appendChild(typingIndicator)
      scrollChatToBottom()
      if(keys.AZURE_CHATBOT_ENDPOINT && keys.AZURE_CHATBOT_API_KEY){
        callRAGEndpoint(message, keys.AZURE_CHATBOT_ENDPOINT, keys.AZURE_CHATBOT_API_KEY, 'chatMessages', function(result) {
          chatMessages.removeChild(typingIndicator)
          addMessage(result);          
        });
      }
      else{
        $('#chatMessages').append("Please provide the end point and api key to get the response")
      }
    }
  }

  sendMessage.addEventListener("click", handleSendMessage)

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  })

  // Add focus to input when clicking anywhere in the chat container
  document.querySelector(".chat-container").addEventListener("click", (e) => {
    // Prevent the click from bubbling up to the panel header
    e.stopPropagation()
    messageInput.focus()
  })

  // Add hover effects to panels
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.addEventListener("mouseenter", () => {
      panel.style.zIndex = "10"
    })

    panel.addEventListener("mouseleave", () => {
      panel.style.zIndex = "1"
    })
  })
  
  // Initialize chat messages scroll
  scrollChatToBottom()
  
  function callRAGEndpoint(userInput, endpointURL, apikey, divName, callback){
    $.ajax({
      url: '/ask',
      method: 'POST',
      data: { query: userInput, url: endpointURL, apikey: apikey},
      success: function(response) {
          if (response.answer) {            
            if (callback) callback(response.answer);          
          } else {
              $('#'+divName).append('<p><strong>Error:</strong> ' + response.error + '</p>');
              hideLoadingImage(divName)
          }
      },
      error: function() {
        $('#'+divName).append('<p><strong>Error:</strong> An error occurred while processing your request.</p>');
        hideLoadingImage(divName)        
      }
    });

  }

  function typeMessage(element, message, speed = 30) {
      let index = 0;
      function type() {
          if (index < message.length) {
              element.textContent += message.charAt(index);
              index++;
              setTimeout(type, speed);
          }
          scrollChatToBottom()
      }
      type();
  }

  function hideLoadingImage(divName){
    if (divName =="divCallSummary"){
      firstPanelLoading.classList.add("hidden")
    }
    if (divName =="divTrainingModule"){
      secondPanelLoading.classList.add("hidden")
    }
    if (divName =="divrmGrading"){
      thirdPanelLoading.classList.add("hidden")
    }
    if (divName =="divredoneConversation"){
      fourthPanelLoading.classList.add("hidden")
    }
  }

  function showLoadingImage(divName){
    if (divName =="divCallSummary"){
      firstPanelLoading.classList.remove("hidden")
    }
    if (divName =="divTrainingModule"){
      secondPanelLoading.classList.remove("hidden")
    }
    if (divName =="divrmGrading"){
      thirdPanelLoading.classList.remove("hidden")
    }
    if (divName =="divredoneConversation"){
      fourthPanelLoading.classList.remove("hidden")
    }
  }
  // Create typing indicator with animated dots
  function createTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message bot typing-message"

    const indicatorSpan = document.createElement("div")
    indicatorSpan.className = "typing-indicator"

    // Create the three dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span")
      indicatorSpan.appendChild(dot)
    }

    typingDiv.appendChild(indicatorSpan)
    return typingDiv
  }

  function formatMarkdownResponse(responseText) {
      
      responseText = responseText.replace(/```markdown|```/g, "").trim();

      responseText = responseText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      const formattedHTML = responseText
          .split("\n\n") 
          .map(paragraph => `<p>${paragraph.trim()}</p>`)
          .join("");

      return formattedHTML;
  }


  function formatResponse(responseText) {
      const lines = responseText.trim().split("\n");
      let insideTable = false;
      let headers = [];
      let rows = [];
      let finalHTML = "";
      let extraContent = "";

      lines.forEach(line => {
          line = line.trim();

          // Detect start of a table (line starts and ends with "|")
          if (line.startsWith("|") && line.endsWith("|")) {
              insideTable = true; 
              const columns = line.split("|").map(col => col.trim()).filter(col => col.length > 0);

              // Ignore lines that are just dashes (---)
              if (!columns.every(col => col.match(/^[-]+$/))) {
                  if (headers.length === 0) {
                      headers = columns;  // First row is the header
                  } else {
                      rows.push(columns); // Add data rows
                  }
              }
          } else if (insideTable && line === "") {
              // Table ended, so process it
              insideTable = false;

              if (headers.length > 0 && rows.length > 0) {
                  finalHTML += `<table class="table table-striped table-bordered">
                                  <thead class="thead-dark">
                                      <tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr>
                                  </thead>
                                  <tbody>
                                      ${rows.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join("")}</tr>`).join("")}
                                  </tbody>
                              </table><br/>`;
              }
              headers = [];
              rows = [];
          } else if (!insideTable && line !== "") {              
              extraContent += `<p>${line}</p>`;
              extraContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          }
      });

      // Append the last table if it wasn't appended
      if (headers.length > 0 && rows.length > 0) {
          finalHTML += `<table class="table table-striped table-bordered">
                          <thead class="thead-dark">
                              <tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr>
                          </thead>
                          <tbody>
                              ${rows.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join("")}</tr>`).join("")}
                          </tbody>
                      </table><br/>`;
      }

      // Inject tables and extra text into the target div
      return finalHTML + `<div>${extraContent}</div>`;
  }
  function formatTable(responseText) {
    const lines = responseText.trim().split("\n");
    let tableHTML = "";
    let insideTable = false;  // Flag to detect if we are inside a table
    let headers = [];
    let rows = [];

    lines.forEach(line => {
        line = line.trim();
        
        // Check if the line starts and ends with a pipe '|', indicating a table row
        if (line.startsWith("|") && line.endsWith("|")) {
            insideTable = true;  // We have found a table
            
            const columns = line.split("|").map(col => col.trim()).filter(col => col.length > 0);
            
            if (headers.length === 0) {
                headers = columns;  // Set headers dynamically
            } else {
                rows.push(columns); // Store row data
            }
        } else if (insideTable && line === "") {
            insideTable = false;  // End of table, process it
        }
    });

    // Generate Bootstrap table only if headers and rows exist
    if (headers.length > 0 && rows.length > 0) {
        tableHTML = `<table class="table table-striped table-bordered">
                        <thead class="thead-dark">
                            <tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr>
                        </thead>
                        <tbody>
                            ${rows.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join("")}</tr>`).join("")}
                        </tbody>
                    </table>`;
    }

    return tableHTML;
}
  function formatResult(result){
    // Split text into lines
    const lines = result.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  
    // Extract headers from the first row
    const headers = lines[0].split("|").map(col => col.trim()).filter(col => col);
    
    // Create table element
    let tableHTML = `<table class="table table-bordered"><thead class="table-dark"><tr>`;

    // Append table headers
    headers.forEach(header => {
        tableHTML += `<th>${header.replace(/\*\*/g, '')}</th>`; // Remove ** for bold
    });
    tableHTML += `</tr></thead><tbody>`;

    // Process remaining rows
    for (let i = 2; i < lines.length; i++) { // Skip separator line
        const columns = lines[i].split("|").map(col => col.trim()).filter(col => col);
        tableHTML += `<tr>`;
        columns.forEach(col => {
            tableHTML += `<td>${col.replace(/\*\*/g, '')}</td>`;
        });
        tableHTML += `</tr>`;
    }

    tableHTML += `</tbody></table>`;
    return tableHTML;
  }
})

