package com.drillmap.crm.repository;

import com.drillmap.crm.domain.entities.Company;
import com.drillmap.crm.domain.entities.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.net.URI;
import java.util.List;

/**
 * Created by sfrensley on 3/29/14.
 */
public interface ContactRepository extends JpaRepository<Contact,Long> {

    public Page<Contact> findByFirstName(@Param(value = "firstName") String firstName, Pageable page);
    public Page<Contact> findByLastName(@Param(value = "lastName") String lastName, Pageable page);
    public Page<Contact> findByCompany(@Param(value = "company") Company company, Pageable page);
    public Page<Contact> findByFirstNameOrLastNameOrCityOrState(@Param(value = "firstName") String firstName,
                                                                     @Param(value = "lastName") String lastName,
                                                                     @Param(value = "city") String city,
                                                                     @Param(value = "state") String state,
                                                                     Pageable page

    );

}
