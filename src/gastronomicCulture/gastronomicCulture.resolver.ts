import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GastronomicCultureDto } from "./gastronomicCulture.dto";
import { GastronomicCultureEntity } from "./gastronomicCulture.entity";
import { GastronomicCultureService } from "./gastronomicCulture.service";

@Resolver()
export class GastronomicCultureResolver {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  @Query(() => [GastronomicCultureEntity])
  async gastronomicCultures() {
    return this.gastronomicCultureService.findAll(true);
  }

  @Query(() => GastronomicCultureEntity)
  async gastronomicCulture(@Args("id") id: string) {
    return this.gastronomicCultureService.findOne(id, true);
  }

  @Mutation(() => GastronomicCultureEntity)
  async createGastronomicCulture(
    @Args("gastronomicCulture") gastronomicCultureDto: GastronomicCultureDto,
  ) {
    return this.gastronomicCultureService.create(gastronomicCultureDto);
  }

  @Mutation(() => GastronomicCultureEntity)
  async updateGastronomicCulture(
    @Args("id") id: string,
    @Args("gastronomicCulture") gastronomicCultureDto: GastronomicCultureDto,
  ) {
    return this.gastronomicCultureService.update(id, gastronomicCultureDto);
  }

  @Mutation(() => String)
  async deleteGastronomicCulture(@Args("id") id: string) {
    this.gastronomicCultureService.delete(id);
    return id;
  }
}
