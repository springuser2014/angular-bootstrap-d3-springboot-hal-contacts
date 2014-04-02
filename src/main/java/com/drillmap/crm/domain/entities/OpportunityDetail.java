package com.drillmap.crm.domain.entities;

import com.drillmap.crm.domain.AuditableEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by tony on 4/2/14.
 */
@Entity
@Table(name = "app_crm_opportunityDetails")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class OpportunityDetail extends AuditableEntity {
    @ManyToOne
    SalesPerson salesPerson;
    Date followUpDate;
    String action;
    @ManyToOne
    Opportunity opportunity;



}
