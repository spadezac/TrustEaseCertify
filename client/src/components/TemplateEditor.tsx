export default function TemplateEditor({ template }: { template: string }) {
    
  
    return (
    <div>
        <h2>Generate Certificate</h2>
        <img src={`http://localhost:5000/api/template/${template}`} alt="Certificate Template" id="certificateTemplate" />
        <form method="POST" action="http://localhost:5000/api/generate-certificate">
            <input type="hidden" id="x" name="x" />
            <input type="hidden" id="y" name="y" />
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" /><br /><br />
            <input type="submit" value="Generate Certificate" />
        </form>
    </div>

//     <h2>Generate Certificate</h2>
//     <img src="{{ url_for('static', filename='uploads/template_small.png') }}" alt="Certificate Template" id="certificateTemplate" onclick="getCursorPosition(event)">
//     <form method="POST" action="{{ url_for('index') }}">
//         <input type="hidden" id="x" name="x">
//         <input type="hidden" id="y" name="y">
//         <label for="name">Name:</label>
//         <input type="text" id="name" name="name"><br><br>
//         <input type="submit" value="Generate Certificate">
//     </form>
//     <script>
//         function getCursorPosition(event) {
//             var rect = document.getElementById("certificateTemplate").getBoundingClientRect();
//             var x = event.clientX - rect.left;
//             var y = event.clientY - rect.top;
//             document.getElementById("x").value = x;
//             document.getElementById("y").value = y;
//         }
//     </script>
// </body>
// </html>

  );
}
