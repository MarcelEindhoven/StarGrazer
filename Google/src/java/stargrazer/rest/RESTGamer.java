/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer.rest;

import static com.google.appengine.repackaged.com.google.common.base.StringUtil.JsEscapingMode.JSON;
import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;
import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jdk.nashorn.internal.objects.Global;
import jdk.nashorn.internal.parser.JSONParser;
import stargrazer.database.DBGamer;

/**
 *
 * @author Gebruiker
 */
/*
Cloud deployment:
gcloud --project=stargrazer app deploy web
dev_appserver.cmd --port=100 \GitHub\StarGrazer\Google\build\web
curl --request PUT -d "gamerName=testName"  http://127.0.0.1:100/gamer/testID
curl --request POST --header "content-type:application/json" --data "{\"m_userName\":\"user\",\"m_gamerName\":\"gamer\"}" http://stargrazer.appspot.com/gamer
Keep an eye on logging:
gcloud --project=stargrazer app logs tail -s default
*/
public class RESTGamer extends HttpServlet {
    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        
        String userName = pathInfo.substring(1);
        String gamerName = request.getParameter("gamerName");
        DBGamer gamer = new DBGamer(userName, gamerName);
        gamer.persist();
        response.setContentType("text/plain;charset=UTF-8");
        ServletOutputStream outputStream = response.getOutputStream();
        DBGamer stored = DBGamer.retrieve(userName);
        outputStream.print(stored.gamerName());
    }
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        test(request, response);
    }
    public void test(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Helper function to investigate rest/firestore details
        response.setContentType("text/plain;charset=UTF-8");
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.print("Test output\n");
        // Test paraameters which have the form ?name=value
        String parameter = request.getParameter("userName");
        outputStream.print(" Parameter userName: " + parameter + "\n");
        // path info
        String userNamePathInfo = "null";
        String pathInfo = request.getPathInfo();
        if (null != pathInfo) {
            userNamePathInfo = pathInfo.substring(1);
        }
        outputStream.print(" PathInfo userName: " + userNamePathInfo + "\n");
        String contentType = request.getContentType();
        if (null == contentType) {
            contentType = "null";
        }
        outputStream.print(" ContentType: " + contentType + "\n");
        String json = "null";
        try {
            BufferedReader reader = request.getReader();
            StringBuilder builder = new StringBuilder();
            String line;
            while (null != (line = reader.readLine())) {
                builder.append(line);
            }
            json = builder.toString();
            Gson gson = new Gson();
            DBGamer gamer = gson.fromJson(json, DBGamer.class);
            json = gamer.userName();
        }
        catch(IOException ex) {
            outputStream.print(" getReader IOException: " + ex + "\n");
        }
        outputStream.print(" json: " + json + "\n");
    }
    public void realPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userName = request.getParameter("userName");
        String gamerName = request.getParameter("gamerName");
        DBGamer gamer = new DBGamer(userName, gamerName);
        gamer.persist();
        response.setContentType("text/plain;charset=UTF-8");
        ServletOutputStream outputStream = response.getOutputStream();
        DBGamer stored = DBGamer.retrieve(userName);
        outputStream.print(stored.gamerName());
    }

    public DBGamer fromRequest(HttpServletRequest request) {
        DBGamer gamer = new DBGamer("dummy", "dummy");
        try {
            BufferedReader reader = request.getReader();
            StringBuilder builder = new StringBuilder();
            String line;
            while (null != (line = reader.readLine())) {
                builder.append(line);
            }
            Gson gson = new Gson();
            gamer = gson.fromJson(builder.toString(), DBGamer.class);
        }
        catch(IOException ex) {
        }
        return gamer;
    }
    
            
    
}
