package com.example.restservice.api;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.restservice.service.DirectorService;

@RestController
@RequestMapping("api/director")
public class DirectorController {
    @Autowired
    private final DirectorService directorService;

    @Autowired
    public DirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }

    @GetMapping("/getDirector")
    public ResponseEntity<Object> getDirector(@RequestParam(name = "id") Long id) {
        JSONObject response = directorService.getDirector(id);
        return ControllerResponses.generateHttpResponse(response);
    }
}
