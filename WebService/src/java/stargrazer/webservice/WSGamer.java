/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package stargrazer.webservice;

import javax.jws.WebParam;
import stargrazer.database.DBGamer;

/**
 *
 * @author Gebruiker
 */
@javax.jws.WebService
public class WSGamer {
    private String message = new String("Hello, ");

    public void WSGamer() {
    }

    @javax.jws.WebMethod
    public String signIn(@WebParam(name = "username") String name) {
        DBGamer g = DBGamer.retrieve(name);
        if (null != g) {
            return message + g.gamerName() + ".";
        } else {
            return message + "Unknown user" + ".";
        }
    }

    @javax.jws.WebMethod
    public String signUp(@WebParam(name = "username") String userName, @WebParam(name = "gamername") String gamerName) {
        DBGamer g = new DBGamer(userName, gamerName);
        g.persist();
        return message + gamerName + ".";
    }
}