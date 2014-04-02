package com.drillmap.crm.repository;

import com.drillmap.crm.TestConfig;
import com.drillmap.crm.domain.entities.Company;
import com.drillmap.crm.domain.entities.Contact;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;


/**
 * Created by sfrensley on 3/29/14.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@SpringApplicationConfiguration(classes = TestConfig.class)
@Transactional
public class ContactRepositoryTest {

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    ContactRepository contactRepository;

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Autowired
    CompanyRepository companyRepository;

    @Test
    public void testFind() {
        Company myCompany = new Company();
        myCompany.setCompanyName("myCompany");
        Company mySavedCompany = companyRepository.save(myCompany);
        //create a contact
        Contact c = new Contact();
        c.setFirstName("Shane");
        c.setLastName("Frensley");
        c.setCompany(mySavedCompany);

        //save a contact
        contactRepository.save(c);
        List<Contact> contacts = contactRepository.findAll();
        assertThat(contacts.size(), is(greaterThan(0)));
        assertThat(contacts.get(0).getId(), is(greaterThan(0L)));
    }

    @Test
    public void testRelationship() {
        Company myCompany = new Company();
        myCompany.setCompanyName("myCompany");
        Company mySavedCompany = companyRepository.save(myCompany);
        assertThat(mySavedCompany.getId(), notNullValue());
        //
        System.out.println(">>>>>>>" + mySavedCompany);
        Contact c = new Contact();
        c.setFirstName("Tony");
        c.setLastName("Hayes");
        c.setCompany(mySavedCompany);
        Contact c1 = contactRepository.save(c);

        assertThat(c1.getId(), notNullValue());
        c1 = contactRepository.findOne(c1.getId());
        assertThat(c1.getCompany(), notNullValue());

        Company company1 = companyRepository.findOne(mySavedCompany.getId());
        assertThat(company1,notNullValue());
        Collection<Contact> contacts = company1.getContacts();
        System.out.println(company1 + " >>>>>>> " + contacts);
        assertThat(contacts.size(),is(greaterThan(0)));
        //assertThat(contacts, hasItem(c1));
        List<Contact> tony2 = contactRepository.findByFirstName("Tony");
        System.out.println(">>>>"+tony2.get(0).getCompany());

        System.out.println(">>>>>>>" + contacts);
    }

}
