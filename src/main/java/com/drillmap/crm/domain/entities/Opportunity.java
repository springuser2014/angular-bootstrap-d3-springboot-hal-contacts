package com.drillmap.crm.domain.entities;

import com.drillmap.crm.domain.AuditableEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Collection;

/**
 * Created by tony on 4/2/14.
 */
@Entity
@Table(name = "app_crm_opportunities")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Opportunity extends AuditableEntity {
    @ManyToOne
    Company company;
    @ManyToOne
    SalesPerson salesPerson;
    @ManyToOne
    Contact contact;
    @ManyToOne
    Probability probability;
    String discussion;
    String potentialRevenue;

    @OneToMany(mappedBy = "opportunity",fetch = FetchType.EAGER)
    Collection<OpportunityDetail> opportunityDetails;

    @OneToMany(mappedBy = "opportunity",fetch = FetchType.EAGER)
    Collection<OpportunityForm> opportunityFormItems;

}
